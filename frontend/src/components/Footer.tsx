interface FooterProps {
  theme: 'dark' | 'light';
}
const Footer = ({
  theme
}: FooterProps) => {
  return <footer className={`py-6 ${theme === 'dark' ? 'bg-[#14161A]' : 'bg-[#F0F2F5]'} mt-8`}>
      <div className="container mx-auto px-4 text-center">
        <p className={`text-sm ${theme === 'dark' ? 'text-[#A3A8AE]' : 'text-[#6B7280]'}`}>
          Built by <span className="font-medium">Veer Singh</span> ©2025
        </p>
      </div>
    </footer>;
};
export default Footer;