import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import Editor from '@monaco-editor/react'

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const BODY_FORMATS = ['JSON', 'XML', 'Form Data', 'Text']

const DEFAULT_BODIES = {
  JSON: `{
  "key": "value",
  "number": 42,
  "nested": { "example": true }
}`,
  XML: `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <key>value</key>
  <number>42</number>
  <nested>
    <example>true</example>
  </nested>
</root>`,
  'Form Data': `key=value
number=42
nested[example]=true`,
  'Text': `Example request body
Line 2
Line 3`
}

const toastStyles = {
  style: {
    background: 'rgba(17, 25, 40, 0.9)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    color: '#FFF',
    padding: '20px 24px',
    borderRadius: '16px',
    fontSize: '1.2rem',
    minWidth: '300px',
    maxWidth: '500px',
    border: '1px solid rgba(255, 255, 255, 0.125)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  duration: 4000,
  position: 'top-right',
}

function App() {
  const [url, setUrl] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('POST')
  const [bodyFormat, setBodyFormat] = useState('JSON')
  const [bodyContent, setBodyContent] = useState(DEFAULT_BODIES.JSON)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditorReady, setIsEditorReady] = useState(false)

  const getEditorLanguage = (format) => {
    switch (format) {
      case 'JSON':
        return 'json'
      case 'XML':
        return 'xml'
      case 'Form Data':
        return 'plaintext'
      case 'Text':
        return 'plaintext'
      default:
        return 'json'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url) {
      toast.error(
        <div className="flex items-center space-x-3">
          <span className="text-2xl">❌</span>
          <div>
            <h3 className="font-bold text-lg">Error</h3>
            <p>Please enter a URL</p>
          </div>
        </div>,
        {
          ...toastStyles,
          icon: false
        }
      )
      return
    }
    setIsLoading(true)
    toast.loading(
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6">
          <svg className="animate-spin w-full h-full text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg">Testing API</h3>
          <p>Please wait...</p>
        </div>
      </div>,
      {
        ...toastStyles,
        icon: false
      }
    )
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    toast.dismiss()
    toast.success(
      <div className="flex items-center space-x-3">
        <span className="text-2xl animate-bounce">✅</span>
        <div>
          <h3 className="font-bold text-lg">Success</h3>
          <p>API test completed!</p>
        </div>
      </div>,
      {
        ...toastStyles,
        icon: false
      }
    )
  }

  const handleEditorDidMount = () => {
    setIsEditorReady(true)
  }

  const showBodyEditor = selectedMethod !== 'GET' && selectedMethod !== 'DELETE'

  const handleFormatChange = (e) => {
    const newFormat = e.target.value
    setBodyFormat(newFormat)
    setBodyContent(DEFAULT_BODIES[newFormat])
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-morphism p-8 w-full max-w-4xl shadow-xl relative"
      >
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          API Fuzztester
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2 font-medium">HTTP Method</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border-gray-700 
                            text-white font-medium cursor-pointer
                            focus:ring-2 focus:ring-purple-500 focus:border-transparent
                            hover:bg-gray-700/50 transition-colors duration-200"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                  }}
                >
                  {HTTP_METHODS.map((method) => (
                    <option 
                      key={method} 
                      value={method} 
                      className="bg-gray-800 text-white py-2"
                    >
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">API URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border-gray-700 
                            text-white placeholder-gray-400
                            focus:ring-2 focus:ring-purple-500 focus:border-transparent
                            hover:bg-gray-700/50 transition-colors duration-200"
                  placeholder="https://api.example.com/endpoint"
                />
              </div>
            </div>

            <AnimatePresence>
              {showBodyEditor && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ 
                    duration: 0.3,
                    ease: 'easeInOut'
                  }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="block text-white mb-2 font-medium">Body Format</label>
                    <select
                      value={bodyFormat}
                      onChange={handleFormatChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border-gray-700 
                                text-white font-medium cursor-pointer
                                focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                hover:bg-gray-700/50 transition-colors duration-200"
                      style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none',
                      }}
                    >
                      {BODY_FORMATS.map((format) => (
                        <option 
                          key={format} 
                          value={format}
                          className="bg-gray-800 text-white py-2"
                        >
                          {format}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="h-[300px] rounded-lg overflow-hidden border border-gray-700">
                    {!isEditorReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                    <Editor
                      height="100%"
                      defaultLanguage={getEditorLanguage(bodyFormat)}
                      language={getEditorLanguage(bodyFormat)}
                      value={bodyContent}
                      onChange={setBodyContent}
                      theme="vs-dark"
                      onMount={handleEditorDidMount}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-purple-600 
                     text-white font-medium rounded-lg 
                     hover:bg-purple-700
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                     focus:ring-offset-gray-900
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Testing...
              </span>
            ) : (
              'Start Testing'
            )}
          </button>
        </form>

        <div className="mt-12 pt-6 border-t border-gray-700/50">
          <div className="flex items-center justify-center space-x-6">
            <a
              href="https://t.me/raresmth"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <div className="flex flex-col items-start">
                <span className="font-medium">@raresmth</span>
                <span className="text-xs text-gray-500">Channel</span>
              </div>
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="https://t.me/alwaysgolang"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <div className="flex flex-col items-start">
                <span className="font-medium">@alwaysgolang</span>
                <span className="text-xs text-gray-500">Contact</span>
              </div>
            </a>
          </div>
        </div>
      </motion.div>

      <Toaster 
        position="top-right"
        toastOptions={{
          className: '',
          style: toastStyles.style,
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }}
        containerStyle={{
          top: 40,
          right: 40,
        }}
        gutter={24}
      />
    </div>
  )
}

export default App
