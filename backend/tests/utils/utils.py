import random
import string

def random_lower_string(length=12) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=length))


def random_email() -> str:
    return f"{random_lower_string(15)}@{random_lower_string(10)}.com"