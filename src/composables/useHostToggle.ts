export const useHostToggle = () => {
    const enabled = useState('host-toggle', () => false)

    return {
        enabled
    }
}