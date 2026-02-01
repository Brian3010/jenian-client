// 'use client';

// import CreateReportButton from '@/components/create-report-button';
// import TelegramTokenGenerateButton from '@/components/tele-token-generator-button';
// import { Card, CardAction, CardHeader } from '@/components/ui/card';
// import { isTelegramLinked } from '@/features/telegram/services/telegram.service';
// import { BotMessageSquare, Clipboard } from 'lucide-react';
// import { useEffect, useState } from 'react';

// export default function BotConnectCard() {
//   const [isLinked, setIsLinked] = useState<{ status: boolean; message: string } | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   useEffect(() => {
//     (async () => {
//       try {
//         setIsLoading(true);
//         const res = await isTelegramLinked();
//         console.log('🚀 ~ BotConnectCard ~ res:', res);

//         if (!res) setIsLinked({ status: false, message: 'Not Connected' });
//         else setIsLinked({ status: true, message: 'Connected' });
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, []);
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
//               {/* {isLinked ? 'Connected' : 'Not Connected'} */}
//               {!isLoading && isLinked && isLinked.message}
//             </p>
//           </div>
//         </div>
//       </CardHeader>
//       {/* <CardDescription className="px-2">{item.description}</CardDescription> */}

//       {!isLoading && !isLinked && (
//         <CardAction>
//           <TelegramTokenGenerateButton />
//         </CardAction>
//       )}
//     </Card>
//   );
// }

import TelegramTokenGenerateButton from '@/components/tele-token-generator-button';
import { Card, CardAction, CardHeader } from '@/components/ui/card';
import { aspnetFetch } from '@/lib/auth/aspnet';
import { BotMessageSquare } from 'lucide-react';

export default async function BotConnectCard() {
  const { res } = await aspnetFetch('/api/Telegram/is-linked');

  const { isLinked } = await res.json();
  console.log('🚀 ~ BotConnectCard ~ isLinked:', isLinked);

  return (
    <Card className="p-2 gap-0">
      <CardHeader className="p-2">
        <div className="flex gap-4 ">
          <span className="self-center border-2 flex size-10 items-center justify-center rounded-xl border-black">
            <BotMessageSquare />
          </span>
          <div>
            <h1 className="self-center font-semibold text-lg">Connect to Telegram Chatbot</h1>
            <p className="text-sm  rounded-sm inline-block px-2 bg-green-200 text-gray-700">
              {isLinked ? 'Connected' : 'Not Connected'}
            </p>
          </div>
        </div>
      </CardHeader>
      {/* <CardDescription className="px-2">{item.description}</CardDescription> */}

      {!isLinked && (
        <CardAction>
          <TelegramTokenGenerateButton />
        </CardAction>
      )}
    </Card>
  );
}
