import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Counter</h2>
      <p style={{ fontSize: '1.5rem' }}>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>➕</button>
      <button onClick={() => setCount(count - 1)}>➖</button>
    </div>
  );
};

export default Counter;
