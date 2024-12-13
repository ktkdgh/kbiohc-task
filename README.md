## 프로젝트 설명

과제 목표는 로그인 기능부터 시작해 **CRUD 기능이 가능한 게시판**을 개발하는 것입니다. 이를 위해, 게시글을 생성, 읽기, 수정, 삭제하는 기능을 구현하고, 이를 사용자 인증을 기반으로 처리합니다.

## 사용 기술

- **백엔드**: NestJS, TypeScript
- **프론트엔드**: Next.js
- **데이터베이스**: MongoDB
- **인증**: JWT(JSON Web Token)
- **ORM**: Mongoose

## 설치 방법

1. GitHub 저장소를 클론합니다:
   ```bash
   git clone https://github.com/ktkdgh/kbiohc-task.git
   ```
2. 프로젝트 디렉터리로 이동:
   ```bash
   cd kbiohc-task
   ```
3. 의존성 설치:
   ```bash
   yarn install
   ```
4. 개발 서버 실행:
   ```bash
   yarn dev:backend
   yarn dev:frontend
   ```

## 사용법

1. 메인 페이지에서는 로그인 없이 게시글을 볼 수 있습니다.
2. 게시글을 작성하려면 로그인이 필요합니다.
3. 로그인 후, 게시판에서 CRUD 작업을 할 수 있습니다.
4. 게시글 작성, 수정, 삭제는 API 호출을 통해 가능합니다.
5. React와 Next.js로 개발된 클라이언트 애플리케이션을 통해 API와 상호작용합니다.