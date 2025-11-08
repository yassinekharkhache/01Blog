#!/bin/zsh
while true; do
    TARGET_DIR="/home/yassine/project/01Blog/back_end/uploads/images"
    find "$TARGET_DIR" -type f -mtime +1 -delete

    TARGET_DIR2="/home/yassine/project/01Blog/back_end/uploads/videos"
    find "$TARGET_DIR2" -type f -mtime +1 -delete

    sleep 864000
done