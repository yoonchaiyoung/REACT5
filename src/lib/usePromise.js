// 타이밍과 상태를 정의
import { useState, useEffect } from "react";

// promiseCreator : 비동기 처리 대상 함수 (대기해야 할 함수 - await)
// deps : 의존성 리스트
// deps는 지금같은 경우에는 카테고리.

// NewsList는 promiseCreator를 실행만 시켜놓고 내 일만 함.
// 언제 끝날지 신경 X, 기다리지X. 다 됐으면 나한테 알려줘~
// 근데 usePromise(hook임)는 promiseCreator가 언제 끝날 지 기다림. 신경O.
// 왜냐하면 끝나면 NewsList에게 상태를 알려줘야하기 때문에.(로딩, 완료, 에러). 상태를 통한 알림.

// NewsList : 일을 시키는 친구
// usePromise : 일을 하는 친구
export default function usePromise(promiseCreator, deps) {
  // usePromise의 상태 3개 : 로딩 완료 실패
  // 로딩, 완료, 실패에 대한 상태 관리
  const [loading, setLoading] = useState(false); // false : 아직 완료되기 전 상태  // true : 완료 상태
  const [resolved, setResolved] = useState(null);
  const [error, setError] = useState(null);

  // 잘못된 처리
  //   useEffect(async () => {
  // 이 함수는 절대 비동기가 되면 안된다. -> async를 붙이면 안 된다!
  // -> 렌더링 되는 과정을 비동기로 처리하면 안됨.
  // useEffect 안의 함수에 절대로 async 걸면 X!!
  // useEffect : 렌더링 하는 과정..
  //   }, deps);

  // 올바른 처리
  useEffect(() => {
    // useEffect까지는 동기처리

    // 1. 비동기 처리 함수를 만들고
    const process = async () => {
      setLoading(true);
      // 성공했을 때, 실패했을 때의 처리 나누기
      try {
        const resolved = await promiseCreator();
        setResolved(resolved);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    // 2. 따로 호출한다.
    process(); // 여기가 비동기 처리가 되어야 한다.
  }, deps);

  return [loading, resolved, error];
  // component 상태에 따른 비동기 처리
}
