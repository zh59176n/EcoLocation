import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Counter</h2>
      <p style={{ fontSize: '1.5rem' }}>Count: {count}</p>
      
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setCount(count + 1)}>➕</button>
        <button onClick={() => setCount(count - 1)}>➖</button>
      </div>
  
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default Counter;