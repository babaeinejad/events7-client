# Events7

## Installation

1. Clone the repository:

```bash
git clone https://github.com/babaeinejad/events7-client.git
```

2. Navigate to the project directory:

```bash
cd events7-client
```

3. Install the project dependencies:

```bash
npm install
```

## Setup the environment

create .env file with this content:

`VITE_BASE_URL="http://localhost:3000"`

create .env.production file with this content:

`VITE_BASE_URL="https://events7-bc6ff29e13f9.herokuapp.com"`

## Usage

### With deployed server

To build and run the React/Vite application, follow these steps:

1. Build the app:

```bash
npm run build
```

preview the app

```bash
npm run preview
```

now you should be able to preview the app in the following URL:

`http://localhost:4173`

### With local nestjs server

1. make sure that the server is running locally

2. run the app:

```bash
npm run dev
```
