'use client';

interface IChatItemProps {
    message: string;
    isSelf: boolean;
}

export default function ChatItem({ message, isSelf }: IChatItemProps) {
    const name = message.split(',')[0];
    const context = message.split(',')[1];
    const time = message.split(',')[2];

    return (<>
        {isSelf ?
            <div className="flex justify-end">
                <div>
                    <div className="text-sm font-bold text-right">
                        {name}
                    </div>
                    <div className="bg-stone-800 text-white p-1 px-3 pb-2 w-fit
                rounded-b-3xl rounded-tl-3xl rounded-tr-sm text-sm break-words max-w-[13rem]" >
                        {context}
                        {/* <div className="text-[0.5rem] leading-[0.5rem] text-gray-300 text-left">
                            {time}
                        </div> */}
                    </div>
                </div>
            </div >
            :
            <div>
                <div className="text-sm font-bold">
                    {name}
                </div>
                <div className="bg-green-400 p-1 px-3 pb-2 w-fit 
                rounded-b-3xl rounded-tr-3xl rounded-tl-sm text-sm" >
                    {context}
                </div>
            </div>
        }
    </>)
}