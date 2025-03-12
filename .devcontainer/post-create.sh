#!/bin/bash
sudo chown vscode .pixi
pixi install
pixi global install mypy
pixi run dev

# Copy env example if not exists
if [ ! -f .env ]; then
    cp .env.example .env
fi
