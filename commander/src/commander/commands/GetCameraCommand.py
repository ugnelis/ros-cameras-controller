import json
from commander.commands.Command import Command


class GetCameraCommand(Command):
    """
    Get the camera command.
    """

    def __init__(self):
        Command.__init__(self)

    def execute(self, **kwargs):
        """
        Execute the command.

        :param kwargs: key-worded arguments.
        :keyword cameras: List of the cameras.
        :keyword id: Camera's ID.
        :return: Response.
        """
        cameras = kwargs.get('cameras')
        id = kwargs.get('id')

        if not id in cameras:
            return [json.dumps({"message": "Camera with this ID does not exist.", "code": 404})]

        return [json.dumps({"camera": cameras[id].to_dict(), "code": 200})]
