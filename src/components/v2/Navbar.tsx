import { Link } from "react-router-dom";
import Logo from "./Logo";

const Navbar = () => {

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl shadow-[0_20px_20px_rgba(0,209,255,0.05)]">
      <div className="flex justify-between items-center px-8 h-16 w-full max-w-none">
        <Logo iconSize="text-2xl" textSize="text-xl" />
        <div className="hidden md:flex space-x-8 items-center">
          <Link className="font-headline font-bold tracking-tight text-[#F5FFF3]/70 hover:text-[#F5FFF3] transition-colors" to="/social-hub">Social Hub</Link>
          <a className="font-headline font-bold tracking-tight text-[#00D1FF] border-b-2 border-[#00D1FF] pb-1" href="#">Features</a>
          <a className="font-headline font-bold tracking-tight text-[#F5FFF3]/70 hover:text-[#F5FFF3] transition-colors" href="#">Pricing</a>
          <a className="font-headline font-bold tracking-tight text-[#F5FFF3]/70 hover:text-[#F5FFF3] transition-colors" href="#">Docs</a>
          <a className="font-headline font-bold tracking-tight text-[#F5FFF3]/70 hover:text-[#F5FFF3] transition-colors" href="#">Status</a>
          <a className="font-headline font-bold tracking-tight text-[#F5FFF3]/70 hover:text-[#F5FFF3] transition-colors" href="#">Contact</a>
        </div>
        <div className="flex items-center space-x-4">
          <Link className="px-4 py-2 text-sm font-headline font-bold text-[#F5FFF3]/70 hover:text-[#F5FFF3] transition-all" to="/login">Login</Link>
          <Link className="px-6 py-2 bg-primary-container text-on-primary font-headline font-bold blue-glow active:scale-95 transition-all" to="/signup">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
