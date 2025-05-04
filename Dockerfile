FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY . .

RUN npm install
RUN npm run build

# Stage 2 - Create production image
FROM node:20-alpine

# Install Python 3 and pip
RUN apk add --no-cache \
    python3 \
    py3-pip \
    py3-virtualenv \
    build-base \
    gfortran \
    python3-dev \
    musl-dev \
    libffi-dev \
    openssl-dev \
    cargo \
    cmake

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev --frozen-lockfile

# Copy the compiled app and environment config from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.prod ./
COPY --from=builder /app/src/ai_model ./src/ai_model

# Optional: Install Python dependencies
# Create Python virtual environment and install dependencies
RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install -r /app/src/ai_model/requirements.txt

CMD ["node", "dist/main.js"]