from django.db import models
from django.utils import timezone

from datetime import datetime
from six import text_type

class InterestedUser(models.Model):
    email = models.EmailField(blank=False, db_index=True) # type: text_type
    org_size = models.IntegerField(null=True) # type: Optional[int]
    comments = models.TextField(null=True) # type: Optional[text_type]
    date_created = models.DateTimeField(default=timezone.now) # type: datetime.datetime
