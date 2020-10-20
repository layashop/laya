from json import dumps as json_dumps, loads as json_loads
from channels.generic.websocket import AsyncWebsocketConsumer
from chat_app.utils import create_chat_room, save_message


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
        print(message)
        await save_message(message)
        await self.send(text_data=json_dumps(message))
