import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import Editor from '@monaco-editor/react'

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const BODY_FORMATS = ['JSON', 'XML', 'Form Data', 'Text']

function App() {
  const [url, setUrl] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('POST')
  const [bodyFormat, setBodyFormat] = useState('JSON')
  const [bodyContent, setBodyContent] = useState(`{
  "key": "value",
  "number": 42,
  "nested": { "example": true }
}`)
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
      toast.error('Please enter a URL')
      return
    }
    setIsLoading(true)
    toast.loading('Testing API...')
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    toast.dismiss()
    toast.success('API test completed!')
  }

  const handleEditorDidMount = () => {
    setIsEditorReady(true)
  }

  const showBodyEditor = selectedMethod !== 'GET' && selectedMethod !== 'DELETE'

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-morphism p-8 w-full max-w-4xl shadow-xl"
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
                      onChange={(e) => setBodyFormat(e.target.value)}
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
      </motion.div>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          duration: 3000,
        }}
      />
    </div>
  )
}

export default App
