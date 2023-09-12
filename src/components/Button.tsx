
function Button(children: string, onClick: any) {
    return <button onClick={onClick} className='bg-sky-700 text-white px-3 py-1 rounded'>
        {children}
    </button>
}

export default Button