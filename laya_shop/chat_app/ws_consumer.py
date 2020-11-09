from json import dumps as json_dumps, loads as json_loads
from channels.generic.websocket import AsyncWebsocketConsumer
from datetime import datetime
from chat_app.utils import (
    create_chat_room,
    save_message,
    update_message,
    update_messages,
    get_count,
    get_message,
)
from chat_app.api.serializers import ChatMessageSerializer


class WSConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(self.scope["user"])
        router_params = self.scope["url_route"]["kwargs"]
        print(json_dumps(router_params))
        emprendedor = router_params.get("emprendedor")
        user_id = router_params.get("user_id")
        self.room_name = "-".join(filter(None, [emprendedor, user_id]))
        print("user_id", user_id)
        if user_id:
            await create_chat_room(self.room_name)
        self.room_group_name = "chat-%s" % self.room_name
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        message = json_loads(text_data)
        await self.channel_layer.group_send(self.room_group_name, message)

    async def chat_message(self, event):
        message = event
        print("Message Received", message)
        new_message = await save_message(message)
        if new_message is not None:
            await self.send(
                text_data=json_dumps(ChatMessageSerializer(new_message).data)
            )
        else:
            message = await get_message(message.get("send_verifier"))
            await self.send(text_data=json_dumps(ChatMessageSerializer(message).data))

    async def seen_messages_current(self, event):
        message_id = event.get("message_id")
        print("Updating to Seen", message_id)
        updated_message = await update_message(message_id)
        await self.send(
            text_data=json_dumps(ChatMessageSerializer(updated_message).data)
        )

    async def seen_messages(self, event):
        user_id = event.get("user_id")
        slug = event.get("slug")
        messages = await update_messages(user_id, slug)
        update_count = await get_count(messages)
        print(update_count, "UPDATE")
        # print("Messages",  messages)
        if update_count > 0:
            await self.send(
                text_data=json_dumps(
                    {
                        "type": "seen_messages",
                        "messages": ChatMessageSerializer(messages, many=True).data,
                    }
                )
            )
