FROM node:latest

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY . .

# EXPOSE命令は、コンテナがどのポート番号を受け付けるようになるかを指定する。
# EXPOSEしただけだとDocker ホストからコンテナにはアクセスできないので、-pオプションでホストのポートとコンテナの公開しているポートをマッピングしてあげる必要がある。
# EXPOSEはポートマッピングを強要するものではなく、どのポートを公開する意図なのかというのを伝える、ある種のドキュメントとしの役割を担う。
EXPOSE 3000

CMD ["npm", "start"]
