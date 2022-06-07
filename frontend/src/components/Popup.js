import {useEffect, useRef} from 'react'

function Popup({children, onClose, isOpen}) {
    const popup = useRef()

    useEffect(() => {
        function handkeKeyEsc(e) {
            const isKyeEsc = e.key === 'Escape'
            isKyeEsc && onClose()
        }

        function handleClickOverflay(e) {
            const isOverflay = e.target === e.currentTarget
            isOverflay && onClose()
        }

        document.addEventListener('keydown', handkeKeyEsc)
        popup.current.addEventListener('mousedown', handleClickOverflay)

        return () => {
            document.removeEventListener('keydown', handkeKeyEsc)
            popup.current.removeEventListener('mousedown', handleClickOverflay)
        }
    })

    return (
        <div
            className={`popup
                ${isOpen && 'popup_opened'}`}
            ref={popup}
        >
            {children}
        </div>
    )
}

export default Popup