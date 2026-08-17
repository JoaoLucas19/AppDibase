interface GroupLogoProps {
  className?: string;
}

export function GroupLogo({ className = '' }: GroupLogoProps) {
  return (
    <div className={`flex justify-center ${className}`.trim()}>
      <img
        src="/logo-dibase.png"
        alt="Di Base Samba e Pagode"
        className="h-40 w-auto max-w-[min(20rem,86vw)] object-contain object-center"
      />
    </div>
  );
}
