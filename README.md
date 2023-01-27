0 실행방법

- 노드, npm, 포스트그레스 버전 표기
- 실행에 필요한 파일 셋팅
- 실행에 필요한 명령어
-

구글 폼을 벤치하였습니다.

## 1. CRUD 시나리오

### 1-1 설문지 생성

```graphql
mutation {
  newServey {
    id
    title
    description
    created
  }
}
```

### 1-2 설문자

설문지를 조회하고 설문을 완료할 수 있다.

- 설문지 R
- 문항 R
- 답변(선택지)R
- 완료된 설문 CR
- 사용자답변테이블의 CRUD는 완료된 설문의 CRUD를 따라감

## 2. DB테이블 구성

### 2-1 설문지 Servey

|       | id  | title | description | created | isUsed  | hasQuestions | success   |
| ----- | --- | ----- | ----------- | ------- | ------- | ------------ | --------- |
| type  | num | str   | str         | date    | boolean | Question[]   | Success[] |
| Field | O   | O     | O           | O       | O       | O            | X         |

부가 설명

- title, description는 기본값이 지정되어 있습니다. 생성된 후, 관리자가 업데이트 해서 바꾸는 방식
- success 는 Servey READ할때 볼 수 없습니다.
- hasQuestions 는 해당 설문지가 가지고 있는 문제들의 배열 입니다.
- isUsed 가 true 일 경우 해당 설문, 문항, 답변을 수정할 수 없게 됩니다.
- update 가능한 Column : title, description

### 2-2 문항 Question

|       | id  | text | isObjective | hasAnswers | serveyId | fromServey |
| ----- | --- | ---- | ----------- | ---------- | -------- | ---------- |
| type  | num | str  | boolean     | Answer[]   | num      | Servey     |
| Field | O   | O    | O           | O          | X        | X          |

부가 설명

- text 는 기본값이 지정되어 추후 변경하는 형태 입니다.
- isObjective 는 객관식여부 입니다. true 상태의 행 들만 답변(선택지)추가가 가능합니다.
- hasAnswers 는 해당 문항이 가지고 있는 답변(선택지)들의 배열 입니다.
- serveyId 는 소속 Servey를 매핑 해주는 역할만 담당합니다.
- update 가능한 Column : text

### 2-3 답변(선택지) Answer

|       | id  | text | reward | listNumber | questionId | fromQuestion |
| ----- | --- | ---- | ------ | ---------- | ---------- | ------------ |
| type  | num | str  | num    | str        | num        | Question     |
| Field | O   | O    | O      | O          | O          | X            |

부가 설명

- 선택지의 순서는 listNumber 입니다
- 한 문항에 최대 10개 까지 답변(선택지)를 등록할 수 있습니다.
- reward 는 해당 답변을 선택했을때 오르게 될 점수 입니다. 기본값 0
  ![과제 특이사항 중](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1022327c-ad55-4bb5-b687-d0f80c4a7fa1/Untitled.png)
  과제 특이사항 중
- update 가능한 Column : text, reward

### 2-3 완료설문 Success

|       | id  | score | serveyId | fromServey | hasUserAnswers |
| ----- | --- | ----- | -------- | ---------- | -------------- |
| type  | num | num   | num      | Servey     | UserAnswer[]   |
| Field | O   | O     | X        | O          | O              |

부가 설명

- score 는 설문지 각 문항에 대한 답변의 총점 입니다.
- hasUserAnswers 를 통해 문항별 응답 및 문항의 text를 열람할 수 있습니다.

### 2-4 설문완료한 유저의 답변 UserAnswer

|       | id  | userAnswers | questionText | answerText | successId | fromSuccessId |
| ----- | --- | ----------- | ------------ | ---------- | --------- | ------------- |
| type  | num | str         | str          | str        | num       | Success       |
| Field | O   | O           | O            | O          | O         | X             |

부가 설명

- 이 테이블은 응답한 설문지에서 유저가 고른 정답을 볼 수 있게 하는 역할을 합니다.
- userAnswers : 유저가 답한 내용
  ⇒ 객관식 : 숫자, 주관식: 적은 내용
- questionText : 문항의 Text
- answerText : 답변(선택지)의 Text
