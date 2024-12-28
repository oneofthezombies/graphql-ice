# RUN optimization in Docker images is performed after prototyping, and RUN is 
# performed for each installation because the installation target changes 
# frequently during prototyping.

FROM mcr.microsoft.com/devcontainers/base:debian-12

SHELL ["/bin/bash", "-c"]

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update
RUN apt install -y curl
RUN apt install -y git
RUN apt clean && \
    rm -rf /var/lib/apt/lists/*

USER vscode
WORKDIR /graphql-steel

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/home/vscode/.cargo/bin:${PATH}"
RUN rustup install 1.83.0
RUN rustup default 1.83.0
RUN rustup target add wasm32-unknown-unknown
RUN cargo install --version 0.2.99 wasm-bindgen-cli
RUN cargo install --version 1.222.0 wasm-tools

RUN ARCH=$(uname -m) && \
    if [ "${ARCH}" != "x86_64" ] && [ "${ARCH}" != "aarch64" ]; then \
        echo "Unsupported architecture: ${ARCH}" && exit 1; \
    fi && \
    BINARYEN_URL="https://github.com/WebAssembly/binaryen/releases/download/version_121/binaryen-version_121-${ARCH}-linux.tar.gz" && \
    curl -L $BINARYEN_URL -o binaryen.tar.gz && \
    tar -xzf binaryen.tar.gz && \
    rm binaryen.tar.gz && \
    mv binaryen-version_121 /home/vscode/binaryen
ENV PATH="/home/vscode/binaryen/bin:${PATH}"

RUN curl https://get.volta.sh | bash
ENV PATH="/home/vscode/.volta/bin:${PATH}"
RUN volta install node@22.12.0
RUN volta install npm@11.0.0

RUN volta install create-cloudflare@2.35.1
RUN volta install esbuild@0.24.2
RUN volta install eslint@9.17.0
RUN volta install sort-package-json@2.12.0
RUN volta install tsx@4.19.2
RUN volta install typescript@5.7.2
RUN volta install vite@6.0.5
RUN volta install vitest@2.1.8
RUN volta install wasm-pack@0.13.1
RUN volta install vercel@39.2.2
RUN volta install create-next-app@15.1.2
RUN volta install webpack@5.97.1
RUN volta install webpack-cli@6.0.1
RUN volta install wrangler@3.99.0

RUN unset DEBIAN_FRONTEND

RUN echo "alias ll='ls -alF'" >> /home/vscode/.bashrc
