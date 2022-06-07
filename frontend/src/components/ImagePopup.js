import Popup from "./Popup"

function ImagePopup({card, onClose}) {
    return (
        <Popup
            onClose={onClose}
            isOpen={card.isOpen}
        >
            <div className="popup__container-img">
                <button
                    className="popup__close"
                    type="button"
                    aria-label="Закрыть"
                    onClick={onClose}
                ></button>
                <img
                    className="popup__big-img"
                    src={card && card.link}
                    alt={card && card.name}
                />
                <p className="popup__title-img">{card && card.name}</p>
            </div>
        </Popup>
    )
}

export default ImagePopup