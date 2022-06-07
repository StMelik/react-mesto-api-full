function PopupWithForm({name, onClose, title, onSubmit, children, buttonText}) {

    return (
        <div className="popup__container">
            <button
                className="popup__close"
                type="button"
                aria-label="Закрыть"
                onClick={onClose}
            ></button>
            <h3 className="popup__title">{title}</h3>
            <form
                className="popup__form"
                name={name}
                onSubmit={onSubmit}
            >
                {children}
                <button className="popup__submit" type="submit">{buttonText}</button>
            </form>
        </div>
    )
}

export default PopupWithForm