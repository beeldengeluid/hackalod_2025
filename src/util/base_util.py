import logging
from datetime import datetime, timezone
from pathlib import Path

LOG_FORMAT = "%(asctime)s|%(levelname)s|%(process)d|%(module)s|%(funcName)s|%(lineno)d|%(message)s"
logger = logging.getLogger(__name__)


def get_repo_root() -> Path:
    """Returns repository root."""
    return Path(__file__).parent / ".." / ".."


# https://stackoverflow.com/questions/52878999/adding-a-relative-path-to-an-absolute-path-in-python
def relative_from_repo_root(path: str) -> Path:
    """Returns the given (relative path) appended to the repository root."""
    return Path(get_repo_root(), path).resolve()


def get_path_from_config(path: str) -> Path:
    """Returns absolute paths and returns relative paths always relative from root."""
    return Path(path) if Path(path).is_absolute() else relative_from_repo_root(path)


def date_time_string():
    dts = datetime.now(timezone.utc)
    return "".join(
        [
            f"{dts.year}",
            f"{dts.month:02}",
            f"{dts.day:02}",
            f"{dts.hour:02}",
            f"{dts.minute:02}",
            f"{dts.second:02}",
        ]
    )
