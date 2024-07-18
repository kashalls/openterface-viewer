export const useViewerMouse = (camera: Ref) => {
  const enabled = useState('mouse', () => false)
  const { pressed } = useMousePressed({ target: camera })
  const lastMousePressState = useState<number>('lastMousePressedState')

  const { isConnected, write } = useSerial()

  const mouse = reactive(useMouse({
    target: camera,
    type: ((event) => {
      return event instanceof TouchEvent || event instanceof Touch ? null : [event.offsetX, event.offsetY]
    })
  }))

  onMounted(() => {
    watch(pressed, (isPressed: boolean) => {
      if (!isPressed) lastMousePressState.value = 0
    })

    watch(mouse, () => handleEvent(), { deep: true })
  })

  const handleEvent = (button: number = pressed.value ? lastMousePressState.value : 0) => {
    if (!enabled.value || !isConnected.value) return

    const relativeX = (mouse.x / camera.value.clientWidth) * 4096
    const relativeY = (mouse.y / camera.value.clientHeight) * 4096

    const data = new Uint8Array(12)
    data.set(MOUSE_ABS_ACTION_PREFIX, 0)
    data.set([button], MOUSE_ABS_ACTION_PREFIX.length)
    data.set([relativeX & 0xFF, (relativeX >> 8) & 0xFF], MOUSE_ABS_ACTION_PREFIX.length + 1)
    data.set([relativeY & 0xFF, (relativeY >> 8) & 0xFF], MOUSE_ABS_ACTION_PREFIX.length + 3)
    data.set([0 & 0xFF], MOUSE_ABS_ACTION_PREFIX.length + 5)

    if (isConnected && enabled.value) write(data)
  }

  const handleClick = ({ button }: MouseEvent) => {
    lastMousePressState.value = Serial.MOUSE_BUTTON_MAP[button] ?? 0
    handleEvent(lastMousePressState.value)
  }

  return {
    enabled,
    pressed,
    mouse,
    lastMousePressState,
    handleEvent,
    handleClick
  }
}