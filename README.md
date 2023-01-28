# 목차

#### 1. 프로젝트 소개 및 실행

#### 2. DB 설계

#### 3. API 코드스니펫

#### 4. LOG

## 1. MainLab Info

### 1-1 사용 스택 및 개발 환경

- 사용 스택
    - TypeScript
    - NestJS
    - typeORM
    - GraphQL
    - PostGreSQL
    - winston
- 개발 환경
    - MacBook M1 Air
    - Node v18.6.0
    - npm v8.13.2

### 1-2 실행 환경

node 와 git 이 설치되어 있어야 합니다.

node 및 git 이 설치되어 있는 경우 0-3으로 넘어가주세요.

- 깃 설치 : 아래 url 로 접속하여 운영체제에 맞게 설치
[https://git-scm.com/downloads](https://git-scm.com/downloads)
- node 설치
<br>
<details>
<summary> 🪟 윈도우 에서 node & npm 설치 길라잡이 </summary>
<div markdown="2">
<h3>1. 아래 주소로 들어가서 node 를 설치 합니다. </h3>
<p>https://nodejs.org/ko/download/</p>
    
<h3>2. 윈도우키 + R 을 누르고 cmd 입력 후 실행</h3>

<p> 아래 명령어 입력 후, v18.x.x 가 나온다면 성공입니다! </p>
<p>node -v</p>
</div>

  
</details>

<br>

<details>
<summary> 🍏 맥 에서 node & npm 설치하기 </summary>
<div markdown="2">
<h3>1. 아래 주소로 들어가서 node를 설치합니다</h3>
<p>https://nodejs.org/ko/download/</p>
  
<h3>2. 커맨드 + 스페이스 을 누르고 terminal 입력 후 실행</h3>

node -v 했을때 v18.x.x 가 나오면 설치 성공!

</div>
  
</details>
<br>
<br>

### 1-3 실행 하기

- MacBook 환경에서 실행하기
    1. CMD + 스페이스바 입력 후, terminal 입력 후 엔터
    2. 아래 명령어 복사후 붙여넣기
        
        ```
        cd ~/desktop
        
        ```
        
        ```
        git clone https://github.com/strombreeding/mindLabServey.git
        
        ```
        
        ```
        cd mindLabServey
        
        ```
        
        ```
        npm ci
        
        ```
        
        ```
        npm start
        
        ```
        

<br>

- Windows 환경에서 실행하는 법
    1. 윈도우키 + R 을 누르고, cmd 검색후 실행
    2. 실행 후 아래 명령어들 차례로 실행
    붙여넣기가 안될시 쉬프트 + Insert 키
        
        ```
        git clone <https://github.com/strombreeding/mindLabServey.git>
        
            ```
        
            ```
            cd mindLabServey
        
            ```
        
            ```
            npm ci
        
            ```
        
            ```
            npm start
        
            ```
        
        ```
        

### 1-4 정상적으로 실행이 되었을때

아래와 같은 사진의 로그들이 나열 됩니다.

![https://user-images.githubusercontent.com/104059932/215104923-cead0afe-3f80-4d2a-b3fd-9087bb9c9b79.png](https://user-images.githubusercontent.com/104059932/215104923-cead0afe-3f80-4d2a-b3fd-9087bb9c9b79.png)

<br>

그리고 [http://localhost:4000/graphql](http://localhost:4000/graphql) 링크로 잘 접속 된다면 실행을 완료한 것 입니다.

<br>

## 2. DB테이블 설계

|  |  |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------|
| ![image](https://user-images.githubusercontent.com/104059932/215267375-7adb3a2d-e819-4185-8fca-f611bc20fcde.png) | ![image](https://user-images.githubusercontent.com/104059932/215267387-038ec037-5188-416c-8ccd-03faff5456f4.png) |
| 설문지 관계도 | 완료설문 관계도 |

<br>

### 2-1 설문지 Servey

|  | id | title | description | created | isUsed | hasQuestions | success |
| --- | --- | --- | --- | --- | --- | --- | --- |
| type | num | str | str | date | boolean | Question[] | Success[] |
| Field | O | O | O | O | O | O | X |

부가 설명

- title, description는 기본값이 지정되어 있습니다. 생성된 후, 관리자가 업데이트 해서 바꾸는 방식
- success 는 Servey READ할때 볼 수 없습니다.
- hasQuestions 는 해당 설문지가 가지고 있는 문제들의 배열 입니다.
- isUsed 가 true 일 경우 해당 설문, 문항, 답변을 수정할 수 없게 됩니다.
- update 가능한 Column : title, description

### 2-2 문항 Question

|  | id | text | isObjective | hasAnswers | serveyId | fromServey |
| --- | --- | --- | --- | --- | --- | --- |
| type | num | str | boolean | Answer[] | num | Servey |
| Field | O | O | O | O | X | X |

부가 설명

- text 는 기본값이 지정되어 추후 변경하는 형태 입니다.
- isObjective 는 객관식여부 입니다. true 상태의 행 들만 답변(선택지)추가가 가능합니다.
- hasAnswers 는 해당 문항이 가지고 있는 답변(선택지)들의 배열 입니다.
- serveyId 는 소속 Servey를 매핑 해주는 역할만 담당합니다.
- update 가능한 Column : text

### 2-3 답변(선택지) Answer

|  | id | text | reward | listNumber | questionId | fromQuestion |
| --- | --- | --- | --- | --- | --- | --- |
| type | num | str | num | str | num | Question |
| Field | O | O | O | O | O | X |

부가 설명

- 선택지의 순서는 listNumber 입니다
- 한 문항에 최대 10개 까지 답변(선택지)를 등록할 수 있습니다.
- reward 는 해당 답변을 선택했을때 오르게 될 점수 입니다. 기본값 0
- 과제 특이사항 을 만족시키기 위한 테이블 입니다.
    
    ![https://user-images.githubusercontent.com/104059932/215116509-7ccecb04-1684-4133-ba6a-9aac62ec49c6.png](https://user-images.githubusercontent.com/104059932/215116509-7ccecb04-1684-4133-ba6a-9aac62ec49c6.png)
    
- update 가능한 Column : text, reward

### 2-3 완료설문 Success

|  | id | score | serveyId | fromServey | hasUserAnswers |
| --- | --- | --- | --- | --- | --- |
| type | num | num | num | Servey | UserAnswer[] |
| Field | O | O | X | O | O |

부가 설명

- score 는 설문지 각 문항에 대한 답변의 총점 입니다.
- hasUserAnswers 를 통해 문항별 응답 및 문항의 text를 열람할 수 있습니다.

### 2-4 설문완료한 유저의 답변 UserAnswer

|  | id | userAnswers | questionText | answerText | successId | fromSuccessId |
| --- | --- | --- | --- | --- | --- | --- |
| type | num | str | str | str | num | Success |
| Field | O | O | O | O | O | X |

부가 설명

- 이 테이블은 응답한 설문지에서 유저가 고른 정답을 볼 수 있게 하는 역할을 합니다.
- userAnswers : 유저가 답한 내용
⇒ 객관식 : 숫자, 주관식: 적은 내용
- questionText : 문항의 Text
- answerText : 답변(선택지)의 Text

## 3. API 코드 스니펫

### ⭐ 설문지 업데이트 API에서 에러 로깅처리를 위하여 의도된 에러가 발생할 수 있습니다.

A 설문 의 title 과, B 설문의 title 이 같아질때 생기는 오류입니다. 

<details>
<summary> 3-1 설문지  </summary>
<div markdown="2">

설문 생성

```
mutation {
  newServey {
    id
    title
    description
    created
  }
}

```

설문 수정

```
mutation {
  updateServey(
    toChange: {
      serveyId: 1 #수정할 설문지 Id
      title: "수정할 텍스트"
      description: "설문지 설명 텍스트"
    }
  ) {
    id
    title
    description
  }
}

```

설문지 하나 조회

```
query{
  servey(serveyId:1 #찾을 설문지 Id){
    id
    title
    description
    created
    hasQuestions{
      id
      text
      isObjective
    }
  }
}

```

설문지 전체 조회

```
query {
  allServey {
    id
    isUsed
    title
    description
    created
    hasQuestions {
      id
      text
      hasAnswers {
        id
        text
      }
    }
  }
}

```

설문지 삭제 \* 연관된 문항, 답변, 완료답변, 유저답변 모두 삭제

```
mutation{
  deleteServey(
		inputServeyId:1 #삭제할 설문지 id
	)
}

```

</div>

</details>

<details>
<summary> 3-2 문항  </summary>
<div markdown="2">

<h2>문항은 servey 조회에서 확인할 수 있습니다. 개별적으로 확인할 수 없습니다.</h2>

문항 생성 및 수정

```
mutation {
  q1: newQuestion(
    createQuestuinInput: {
      fromServeyId: 1 #소속 설문지
      isObjective: true #false = 주관식
    }
  ) {
    id
    text
    isObjective
  }
}

```

문항 수정

```

mutaion{
	qu1:updateQuestion(toChange:{
    questionId:1 #수정할 문항
    text:"하루종일 고단한 하루를 보내고 집에 돌아왔습니다. 특히나 오늘은 직장 상사가 많이 갈궜습니다. 황금 같은 저녁시간, 하루동안 받았던 스트레스를 어떻게 풀으실 예정이죠?"
  }){
    id
    text
  }
}

```

문항 삭제 \* 연관된 답변 모두 삭제

```
mutation {
  deleteQuestion(inputQuestionId: 1)
}

```

</div>

</details>

<details>
<summary> 3-3 답변  </summary>
<div markdown="2">

<h2>답변은 servey 조회에서 확인할 수 있습니다. 개별적으로 확인할 수 없습니다.</h2>

답변 생성 및 수정

```
mutation {
  a1: newAnswer(
    createAnswerInput: {
      questionId: 1 #소속될 문항id
    }
  ) {
    id
    text
  }
}

```

답변 수정

```

mutaion{
	au1: updateAnswer(
    toChange: {
			questionId: 1, #소속된 문항 id
			listNumber: "1", #답변의 번호 Id가 아님
			text: "게임",
			reward: 100 # 문항선택시 점수
		}
  )
}

```

답변 삭제

```
mutation {
  deleteAnswer(inputAnswerId: 1)
}

```

</div>

</details>

<details>
<summary> 3-4 설문지 완료 </summary>
<div markdown="2">

설문완료 생성

```
mutation {
  serveySeccess(
    inputServeyIdAndListNumberOrUserAnswer: {
      serveyId: 1 #완료할 설문지 id
      answerArr: ["2", "3", "1", "green"] #객관식은 listNum, 주관식도 포함OK
    }
  ) {
    id
  }
}

```

설문완료 전부조회

```
query {
  allSuccess {
    id
    #...successProperties
  }
}

```

설문완료 조회

```
query {
  success(
    serialNumber: 731251080337694 #설문완료의 id
  ) {
    score #점수
    hasUserAnswers {
      questionText #문항 제목
      answerText #답변 제목
      userAnswers #사용자의 응답
    }
  }
}

```

설문완료 삭제 \* 연관된 유저응답 삭제

```
mutation{
  deleteSuccess(
		inputSerialNumber: #serialNumber
	)
}

```

</div>

</details>

## 4. 예외처리와 LOG

### 4-1 예외처리

대부분의 예외는 처리해 둔 상태입니다.

에러 Log 를 발생시키기 위한 API가 있으니 4-2 에서 확인해보시길 바랍니다.

CustomError 를 클래스화 하여 예외처리 하였고, 예상하지 못한 에러는 로그를 남기도록 했습니다.

### 4-2 로깅

요청이 성공할 때 마다 사용자의 쿼리, IP, OS 와 에러가 발생한 경로가  /logs/info 디렉토리 안에 저장됩니다. 

현재 예외처리 된 에러는 로그파일로 저장되지 않습니다. 예상하지 못한 에러가 발생한 경우 /logs/error 디렉토리 안에 저장됩니다. 추후, 에러로깅이 발생되면 slack 알림이나 이메일로 보내는 방법을 도입할 예정입니다.

### 의도적으로 에러로깅을 발생시키는 방법입니다.

1. 2개의 설문을 만든다. 각각 A, B 라 칭함
2. A의 title을 “마음 연구소”로 수정한다.
3. B의 title을 “마음 연구소”로 수정한다.

3번에서 예외처리를 하지 않았기 때문에 “예상치 못한 에러”로 간주되어 로깅처리 됩니다.

직접 해보시려면 아래 코드스니펫을 복사하여 주석처리된 부분을 수정하세요.

1.

```graphql
mutation{
  s1 : newServey{
    id
  }
  s2 : newServey{
    id
  }
}
```

2.

```graphql
mutation{
	u1 : updateServey(toChange:{
    serveyId: # s1에서 만들어진 설문의 id
    title:"마음 연구소"
    description:"마음을 다스리는 방법에 대한 설문"
  }){
    id
  }
	u1 : updateServey(toChange:{
    serveyId: # s2에서 만들어진 설문의 id
    title:"마음 연구소"
    description:"마음을 다스리는 방법에 대한 설문"
  }){
    id
  }
}
```

### 로깅 결과

```graphql
{
	"context":"2023-01-28T12:45:48.855Z",
	"level":"error",
	"message":"duplicate key value violates unique constraint \"UQ_f83ac7bd03190070edf6fd99940\"",
	"stack":[
		{
			"clientOs":"Mac",
			"path":"/Users/jinytree/Desktop/ct/dist/utils/error.js"
		}
	]
}
```
