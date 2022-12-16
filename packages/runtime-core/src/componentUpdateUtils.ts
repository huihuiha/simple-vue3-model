export function shouldUpdateComponent(preVNode: any, nextVNode: any) {
  const { props: prevProps } = preVNode;
  const { props: nextProps } = nextVNode;

  for (const key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }

  return false;
}
