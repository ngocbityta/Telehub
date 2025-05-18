const Loading = () => {
    return <div className="flex justify-center items-center h-full w-full">
        <img
            alt="loading"
            className="w-[192px] h-[192px] animate-breathing"
            src={`${process.env.PUBLIC_URL}/logo.png`}
        />
    </div>
}

export default Loading