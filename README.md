# DiffNote

A FastAPI-based REST API for a versioned note-taking app with a React frontend.

## Tech Stack and Rationale

- Backend
  - **FastAPI**: Chosen for its speed, async capabilities, and built-in OpenAPI documentation.
  - [**Pixi.sh**](https://pixi.sh/latest/) A fast conda-based package manager for quickly creating reproducible dev environments.
  - **Alembic**: Handles database schema migrations efficiently.
  - **Postgres**: A relational database that supports JSON storage for flexible note content storage.

- Frontend
  - **React**: Provides a modular and component-driven architecture.
  - **Tiptap**: A rich text editor that supports structured content editing.
  - **Tanstack Router**: Manages routing in a declarative way.
  - **Tanstack Query**: Enables efficient data fetching, caching, and state management.

## Prerequisites

For containerized development (recommended):
- Docker & Docker Compose 
- VS Code with [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension, or any IDE with Dev Containers support
> While VS Code offers the smoothest Dev Containers experience with our pre-configured settings and extensions, you can use any IDE that supports the Dev Containers spec

### Manual Setup (Alternative):
If you prefer a manual setup and want to avoid the 600MB Dev Container image, you can set up your environment manually. However, I strongly recommend using Pixi.sh as your environment and package manager. Pixi.sh offers isolated, reproducible dev environments similar to Docker (though it doesn't provide full containerization).

If you choose not to use Pixi.sh, you can:

  - Create a virtual environment and install dependencies from pyproject.toml using your preferred package manager.
  - Use Docker Compose to run only necessary services (e.g., the database).
  - Run database migrations and start the FastAPI server manually.

