/**
 * Created by nayak on 2017. 1. 15..
 */

/*******************
 * Team Member Permissions
 ********************/
exports.member_permission = {
  REJECTED_MEMBER: -2,
  APPLY_MEMBER: -1,
  APPROVED_MEMBER: 0,
  MASTER_MEMBER: 1
};


/*******************
 *  Make Test Content
 ********************/
exports.makeTestContent = (test_array) => {
  const test_content = {
    test: []
  };
  const answer_list = [];

  // 답변 리스트 생성
  test_array.forEach((question) => {
    answer_list.push(question.answer);
  });

  for (let i=0; i<answer_list.length; i++) {
    const answer_list_temp = []; // 보기들의 리스트를 만들기 위한 정답 리스트의 복사본
    test_array.forEach((question) => {
      answer_list_temp.push(question.answer);
    });
    const answer = answer_list_temp.splice(i, 1)[0]; // 정답을 제외한 보기들의 리스트
    const options_list = answer_list_temp;

    const shuffle_option = {
      rand: '',
      temp: '',
      len: options_list.length,
      result: options_list.slice()
    };

    // 보기 랜덤 섞기
    while (shuffle_option.len) {
      shuffle_option.rand = Math.floor(Math.random() * shuffle_option.len--);
      shuffle_option.temp = shuffle_option.result[shuffle_option.len];
      shuffle_option.result[shuffle_option.len] = shuffle_option.result[shuffle_option.rand];
      shuffle_option.result[shuffle_option.rand] = shuffle_option.temp;
    }

    const answer_index = Math.floor(Math.random() * 4);
    shuffle_option.result.splice(answer_index, 0, answer);  // 인덱스 0 ~ 3 사이에 정답 삽입
    // 시험지에 문제 삽입
    test_content.test.push(
      {
        question: test_array[i].question,
        options: shuffle_option.result.slice(0, 4),
        answer: answer,
        answer_index: answer_index
      }
    );
  }

  return JSON.stringify(test_content);
};