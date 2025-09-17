# 다양한 언어, 다양한 환경에서의 Local MCP Server 예시 코드 입니다.

## 1. http-ping (Node)

1. http-ping 전역 설치
2. Install & Build
   ```
   npm install -g pnpm
   pnpm add zod
   pnpm i
   pnpm dev
   ```

## 2. sysinfo-go (GO)

1. go 설치 ( https://go.dev/dl/ )
2. Install & Build
     ```
     go mod tidy
     go build -o sysinfo-go.exe #빌드 산출물 생성
     ```

## 3. fs-list-rs (Rust)

1. Rust 설치 ( https://www.rust-lang.org/tools/install )

# 4. http-java (java)

1. java 설치
2. java-development-kit 다운로드 ( https://www.oracle.com/java/technologies/downloads/?er=221886#jdk25-windows )

3. maven 설치 (binary-zip)
  ( https://maven.apache.org/download.cgi )
- 환경변수 설정
  1. 새 환경 변수 만들기
     <img width="844" height="225" alt="image (1)" src="https://github.com/user-attachments/assets/9087ebce-7d85-49af-9630-869db5286455" />

  2. path에 추가
     <img width="194" height="34" alt="image (2)" src="https://github.com/user-attachments/assets/6e31f3ca-7be1-4e2f-8d1a-fd5e48a3d2d8" />

## 5. guid-marker-net (C#)

1. 프로젝트 생성
   ```
   dotnet new console -n guid-maker-net
   ```
2. Install & Build
   ```
   dotnet build --verbosity quiet
   ```
   

