# DiffNote

A full-stack versioned note-taking application with a FastAPI backend and React frontend. DiffNote allows users to create, edit, and track changes to their notes over time.

## Tech Stack and Rationale

### Backend

- **FastAPI**: High-performance Python framework with automatic OpenAPI documentation, async support, and strong type validation
- **SQLModel**: SQL database interface built on top of SQLAlchemy and Pydantic
- **PostgreSQL**: Robust relational database with JSON support for flexible note content
- **Alembic**: Database migration tool for smooth schema evolution
- **Pixi.sh**: Fast conda-based package manager for reproducible development environments
- **AsyncPG**: High-performance asynchronous PostgreSQL driver
- **Loguru**: Python logging made simple and powerful
- **MyPy**: Static type checker for Python, ensuring type safety and catching potential errors early

### Frontend

- **React 19**: Latest version with improved rendering capabilities
- **Tanstack Router**: Type-safe routing with built-in data loading
- **Tanstack Query**: Powerful data fetching and caching library
- **Tiptap**: Headless, extensible rich text editor framework
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **ESLint**: JavaScript/TypeScript linter for maintaining code quality and consistency
- **shadcn/ui**: Beautifully designed components built with Radix UI and Tailwind CSS

## Getting Started

### Option 1: Using Dev Containers (Recommended)

Prerequisites:

- Docker & Docker Compose
- VS Code with [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension (or any IDE with Dev Containers support)

Steps:

1. Clone the repository
2. Open the project in VS Code
3. When prompted, click "Reopen in Container" or run the "Dev Containers: Reopen in Container" command
4. The container will set up automatically with all required dependencies
5. **Important**: On first launch, you may need to reload VS Code extensions:
   - Go to the Extensions tab in VS Code
   - Look for the "Dev Container: diffnote" section
   - Under "Extensions", if you see a "Reload Window" option, click it
   - This step is crucial as you may see incorrect syntax highlighting until extensions are properly loaded
6. **Important startup sequence**:
   - The backend and frontend will start automatically, but in this order
   - Wait for the backend to fully initialize at http://localhost:8000 first
   - **After backend is running**, restart the frontend container to generate API clients properly:
     ```bash
     docker restart diffnote-frontend
     ```
   - Frontend will be available at http://localhost:5173
   - You can view the API documentation at http://localhost:8000/api/docs

### Option 2: Manual Setup

Prerequisites:

- [Pixi.sh](https://pixi.sh/latest/) installed on your machine (or via [pixi-docker](https://github.com/prefix-dev/pixi-docker) if you prefer full isolation)
- Node.js v22.12.0 or later
- PostgreSQL database server

Backend Setup:

1. Clone the repository
2. Check your platform in pixi.toml - currently configured for linux-aarch64. Update the platforms line if needed:
   ```toml
   platforms = ["linux-aarch64"] # Change based on your system, see https://pixi.sh/latest/reference/pixi_manifest/#platforms
   ```
3. Create a `.env` file based on `.env.example`
4. Install backend dependencies:
   ```bash
   pixi install
   ```
5. Start the backend server:
   ```bash
   pixi run dev
   ```

Frontend Setup:

1. Navigate to the frontend directory
2. Install dependencies with your preferred package manager:
   ```bash
   cd frontend
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

The app will create the database tables automatically so you don't need to run any migrations manually.

## Technical Details

### Backend Architecture

- **FastAPI**: Selected for its exceptional performance, native async support, and automatic OpenAPI documentation. The type hints and validation system significantly reduces the likelihood of bugs.

- **SQLModel**: Combines the best of SQLAlchemy and Pydantic, providing a powerful ORM with strong type validation, making database operations both safer and more developer-friendly.

- **PostgreSQL**: Chosen for its reliability, robust feature set, and JSON support which allows for flexible schema evolution when storing note content.

- **Pixi.sh**: Provides faster, more reliable dependency management compared to traditional Python tools. Creates reproducible environments that work consistently across different machines.

- **AsyncPG**: Delivers high-performance database access that takes full advantage of FastAPI's async capabilities.

- **Alembic**: Enables smooth database schema migrations, making it easier to evolve the data model as the application grows.

### Frontend Architecture

- **React 19**: Provides a modular and component-driven architecture for building interactive UIs.

- **Tanstack Router**: Offers type-safe routing with built-in data loading capabilities, reducing boilerplate and improving developer experience.

- **Tanstack Query**: Provides sophisticated data fetching, caching, and synchronization capabilities, reducing the need for manual state management.

- **Tiptap**: Extensible rich text editor that outputs structured content, making it ideal for versioned note-taking where diffs need to be tracked accurately.

- **Tailwind CSS v4**: Accelerates UI development with utility-first approach, ensuring consistent styling and responsive design.

- **shadcn/ui**: Provides accessible, reusable components built on top of Radix UI and Tailwind CSS, offering a beautiful design system out of the box.

## Potential Improvements

### Technical Improvements

- **Authentication/Authorization**: Implement JWT or OAuth2 authentication with role-based access control
- **Real-time Collaboration**: Add WebSocket support for simultaneous editing by multiple users
- **Offline Support**: Implement service workers and local storage for offline note editing
- **Full-text Search**: Integrate PostgreSQL full-text search capabilities for better note discovery
- **E2E Testing**: Add Playwright or Cypress for comprehensive end-to-end testing
- **CI/CD Pipeline**: Set up automated testing and deployment workflows
- **Pre-commit Hooks**: Implement pre-commit hooks for code formatting, linting and type checking
- **Observability Stack**:
  - Add OpenTelemetry instrumentation for distributed tracing
  - Implement Prometheus metrics collection and Grafana dashboards
  - Set up structured logging with Loki
  - Add error tracking and monitoring with Sentry
  - Implement health checks and uptime monitoring
- **And More!**: There's always room for improvement 😎

### Feature Enhancements

- **Note Templates**: Create reusable templates for different types of notes
- **Export Options**: Add support for exporting notes to PDF, Markdown, or other formats
- **Tags and Categories**: Implement a tagging system for better organization
- **Sharing and Collaboration**: Allow notes to be shared with specific users with different permission levels
- **Advanced Diff Visualization**: Enhance the diff view to make tracking changes more intuitive
- **Rich Text Formatting**: Enhance Tiptap editor with advanced formatting options and better styling
- **Version Management**: Add ability to delete version history or compare any two versions side-by-side
