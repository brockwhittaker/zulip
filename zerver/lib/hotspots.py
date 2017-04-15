from zerver.models import UserProfile, UserHotspot

from typing import List, Text

ALL_HOTSPOTS = [
    ('welcome', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut faucibus'
     'orci. Nulla placerat'),
    ('streams', 'leo sed sem placerat venenatis. Sed suscipit, lacus vel rhoncus varius,'
     'eros rutrum turpis, vitae hendrerit dui lacus sed libero. Etiam luctus placerat'
     'tellus a aliquam. Aenean sem turpis, convallis eu tempor vel, vestibulum vitae metus.'
     'Curabitur sapien ex, elementum'),
    ('topics', 'vitae hendrerit dui lacus sed libero. Etiam luctus placerat'),
    ('narrowing', 'eros rutrum turpis, vitae hendrerit dui lacus sed libero. Etiam luctus placerat'),
    ('replying', 'really short'),
    ('get_started', 'Donec nec felis volutpat mi bibendum semper. Ut vel justo dignissim, pretium'
     'urna a, aliquam libero. Morbi laoreet justo ut molestie vehicula. Aliquam vel ligula')
]

def get_next_hotspots(user):
    # type: (UserProfile) -> List[Tuple(str, Text)]
    seen_hotspots = frozenset(UserHotspot.objects.filter(user=user).values_list('hotspot', flat=True))
    for hotspot, text in ALL_HOTSPOTS:
        if hotspot not in seen_hotspots:
            return [(hotspot, text)]
    return []
