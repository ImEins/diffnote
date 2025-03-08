import sys

from pathlib import Path

from loguru import logger

from src.core.settings import settings


def setup_logging():
    """
    Customize loguru logger
    1. Remove default handler
    2. Add console handler with custom format
    3. Add file handler for non-development environments

    Args:
        None

    Returns:
        logger: loguru logger instance
    """
    logger.remove()

    logger.add(
        sys.stderr,
        format=settings.LOG_FORMAT,
        level=settings.LOG_LEVEL,
        colorize=True,
    )

    if settings.ENVIRONMENT != 'dev':
        log_file = Path(settings.LOG_DIR) / 'app.log'
        logger.add(
            log_file,
            rotation='10 MB',
            retention='1 week',
            compression='zip',
            format=settings.LOG_FORMAT,
            level=settings.LOG_LEVEL,
        )

    return logger


log = setup_logging()
