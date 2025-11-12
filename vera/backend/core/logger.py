# structured logging around the embedding stage

"""
couple of small hardening tweaks so failures are clearly logged ensuring graceful failure handling and no silent failures.
I like my failures loud and clear. 🎤
"""

import logging
import sys

def get_logger(name: str = "vera_backend"):
    logger = logging.getLogger(name)

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(fmt="%(asctime)s - %(name)s | %(levelname)s | %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        logger.propagate = False

    return logger


