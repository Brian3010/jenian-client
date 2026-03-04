'use client';

import TelegramTokenGenerateButton from '@/components/TelegramTokenGenerateButton';
import { Card, CardAction, CardHeader } from '@/components/ui/card';
import useIsUserLinked from '@/hooks/useIsUserLinked';
import { BotMessageSquare } from 'lucide-react';

export default function BotConnectCard() {
  const { isUserLinked, isLoading } = useIsUserLinked();

  return (
    <Card className="p-2 gap-0">
      <CardHeader className="p-2">
        <div className="flex gap-4 ">
          <span className="self-center border-2 flex size-10 items-center justify-center rounded-xl border-black">
            <BotMessageSquare />
          </span>
          <div>
            <h1 className="self-center font-semibold text-lg">Connect to Telegram Chatbot</h1>
            {/* <p className="text-sm  rounded-sm inline-block px-2 bg-green-200 text-gray-700"> */}
            <p
              className={`text-sm  rounded-sm inline-block px-2 ${isUserLinked && isUserLinked.status ? 'bg-green-200' : 'bg-gray-200'}  text-gray-900`}
            >
              {!isLoading && isUserLinked && isUserLinked.message}
            </p>
          </div>
        </div>
      </CardHeader>
      {/* <CardDescription className="px-2">{item.description}</CardDescription> */}

      {!isLoading && isUserLinked && !isUserLinked.status && (
        <CardAction>
          <TelegramTokenGenerateButton />
        </CardAction>
      )}
    </Card>
  );
}

/** Server component testing  */
// import TelegramTokenGenerateButton from '@/components/tele-token-generator-button';
// import { Card, CardAction, CardHeader } from '@/components/ui/card';
// import { aspnetFetch } from '@/lib/auth/aspnet';
// import { BotMessageSquare } from 'lucide-react';

// export default async function BotConnectCard() {
//   const { res } = await aspnetFetch('/api/Telegram/is-linked');
//   console.log('🚀 ~ BotConnectCard ~ res:', res);

//   const { isLinked } = await res.json();
//   console.log('🚀 ~ BotConnectCard ~ isLinked:', isLinked);

//   return (
//     <Card className="p-2 gap-0">
//       <CardHeader className="p-2">
//         <div className="flex gap-4 ">
//           <span className="self-center border-2 flex size-10 items-center justify-center rounded-xl border-black">
//             <BotMessageSquare />
//           </span>
//           <div>
//             <h1 className="self-center font-semibold text-lg">Connect to Telegram Chatbot</h1>
//             <p className="text-sm  rounded-sm inline-block px-2 bg-green-200 text-gray-700">
//               {isLinked ? 'Connected' : 'Not Connected'}
//             </p>
//           </div>
//         </div>
//       </CardHeader>
//       {/* <CardDescription className="px-2">{item.description}</CardDescription> */}

//       {!isLinked && (
//         <CardAction>
//           <TelegramTokenGenerateButton />
//         </CardAction>
//       )}
//     </Card>
//   );
// }
