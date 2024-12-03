export function Footer() {
    return (
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} AMT IA. Todos los derechos reservados.</p>
        <p>Creado por Giancarlo Tonazza, Uruguay</p>
        <a
          href="https://instagram.com/giantonazza"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-purple-400 transition-all duration-300"
        >
          Instagram
        </a>
      </footer>
    )
  }
  
  