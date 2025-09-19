export const connectWS = (pid: string, onMsg: (m: any) => void) => {
  const url = `${process.env.NEXT_PUBLIC_WS_URL}?pipeline_id=${pid}`;
  const open = () => {
    const ws = new WebSocket(url);
    ws.onmessage = e => onMsg(JSON.parse(e.data));
    ws.onclose = () => setTimeout(() => open(), 1000);
    return ws;
  };
  return open();
};

