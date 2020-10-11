from channels.db import database_sync_to_async
from chat_app.models import ChatMessage, ChatRoom
from business.models import Business
from utils.models import safe_get


@database_sync_to_async
def createChatRoom(slug):
    # import pdb

    # pdb.set_trace()
    if safe_get(ChatRoom, slug=slug) is None:
        business_slug, user_id = slug.split("-")
        business = safe_get(Business, slug=business_slug)
        if business is not None:
            ChatRoom.objects.create(
                slug=slug, user_id=int(user_id), business_id=business.id
            )
