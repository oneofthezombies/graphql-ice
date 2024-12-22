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
WORKDIR /graphql-ice

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
RUN volta install npm@10.9.2
RUN volta install eslint@9.17.0
RUN volta install sort-package-json@2.12.0
RUN volta install typescript@5.7.2
RUN volta install tsx@4.19.2
RUN volta install vitest@2.1.8
RUN volta install create-cloudflare@2.35.1

RUN unset DEBIAN_FRONTEND
