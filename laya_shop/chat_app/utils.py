from channels.db import database_sync_to_async
from chat_app.models import ChatMessage, ChatRoom
from business.models import Business
from utils.models import safe_get
from datetime import datetime


@database_sync_to_async
def create_chat_room(slug):
    # import pdb
    # pdb.set_trace()
    if safe_get(ChatRoom, slug=slug) is None:
        business_slug, user_id = slug.split("-")
        business = safe_get(Business, slug=business_slug)
        if business is not None:
            ChatRoom.objects.create(
                slug=slug, user_id=int(user_id), business_id=business.id
            )


@database_sync_to_async
def save_message(message):
    print("save Message")
    try:
        new_message = ChatMessage.objects.create(
            user_id=message.get("user"),
            sender_name=message.get("sender_name"),
            chat_room_id=message.get("chat_room"),
            send_verifier=message.get("send_verifier"),
            message=message.get("message"),
            send_date=datetime.now(),
        )
        if new_message.pk:
            return new_message
    except:
        pass


@database_sync_to_async
def update_message(message_id):
    message = safe_get(ChatMessage, id=message_id)
    message.seen = True
    message.save()
    return message


@database_sync_to_async
def update_messages(user_id, slug):
    messages = ChatMessage.objects.filter(chat_room__slug=slug)
    messages = messages.exclude(user__id=user_id)
    messages.update(seen=True)
    for m in messages:
        print(m.__dict__)
    return messages


@database_sync_to_async
def get_count(queryset):
    return queryset.count()

@database_sync_to_async
def get_message(send_verifier):
    return safe_get(ChatMessage, send_verifier=send_verifier)