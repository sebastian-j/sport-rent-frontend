import footer_logo from '../assets/logo_footer.svg';
import {SocialIcon} from "react-social-icons/component";
import 'react-social-icons/facebook'
import 'react-social-icons/instagram'
import 'react-social-icons/twitter'
import 'react-social-icons/tiktok'

export default function Footer() {
  return (
    <footer className="bg-black text-white p-20 flex items-center justify-center space-x-52">
        <div className="flex flex-col max-w-lg">
            <div className="p-2 b-2">
                <img src={footer_logo} />
            </div>
            <div className="flex items-center text-xl text-gray-400">
                <p>
                    Polar Sport Rent - wypożyczalnia sprzętu outdoorowego dla aktywnych. 
                    W naszej ofercie znajdziesz wszystko, czego potrzebujesz do przygód 
                    w terenie: rowery gravelowe, deski SUP, namioty dachowe, przyczepki 
                    rowerowe, sprzęt wspinaczkowy oraz narty skiturowe. Wypożycz i ruszaj 
                    po przygodę - latem i zimą!
                </p>
            </div>
            <div className="flex space-x-6">
                <SocialIcon url="www.twitter.com" bgColor="black" />
                <SocialIcon url="www.facebook.com" bgColor="black" />
                <SocialIcon url="www.tiktok.com" bgColor="black" />
                <SocialIcon url="www.instagram.com" bgColor="black" />
            </div>
        </div>
        <div>
            <p className="text-2xl font-bold pb-2">Informacje</p>
            <ul className="text-gray-400 text-xl space-y-2">
                <li>O nas</li>
                <li>Kontakt</li>
                <li>Program lojalnościowy</li>
                <li>Regulamin</li>
                <li>FAQ</li>
            </ul>
        </div>
        <div>
            <p className="text-2xl font-bold pb-2">Polar Sport Rent</p>
            <ul className="text-gray-400 text-xl space-y-2">
                <li>ul. Kałuży 1, Kraków</li>
                <li>798 798 798</li>
                <li>Kontakt@psrent.pl</li>
                <li>Godziny otwarcia:</li>
                <li>Pn-Pt 10-20</li>
                <li>Sb-Nd 11-18</li>
            </ul>
        </div>
    </footer>
  );
}