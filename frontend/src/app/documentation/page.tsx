import Link from "next/link"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { CodeIcon, DownloadIcon, Home, MountainIcon, LayersIcon, PuzzleIcon, BookOpenIcon, SparklesIcon, 
    CompassIcon, 
    KeyIcon,
    FileInputIcon,
    CreditCardIcon,
    PaletteIcon ,
    TypeIcon,
    RulerIcon,

} from "lucide-react"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"

export default function Page() {
  return (
    <MaxWidthWrapper className="py-10">
      
      <div className="flex">
        <nav className="hidden lg:flex flex-col w-64 border-r border-foreground   overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Getting Started</h4>
              <Link
                className="flex items-center gap-2 py-1 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-50"
                href="#"
              >
                <Home className="w-4 h-4" />
                <span>Introduction</span>
              </Link>
              <Link
                className="flex items-center gap-2 py-1 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-50"
                href="#"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Installation</span>
              </Link>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">API</h4>
              <Link
                className="flex items-center gap-2 py-1 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-50"
                href="#"
              >
                <CodeIcon className="w-4 h-4" />
                <span>Components</span>
              </Link>
              <Link
                className="flex items-center gap-2 py-1 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-50"
                href="#"
              >
                <LayersIcon className="w-4 h-4" />
                <span>Utilities</span>
              </Link>
              <Link
                className="flex items-center gap-2 py-1 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-50"
                href="#"
              >
                <PuzzleIcon className="w-4 h-4" />
                <span>Hooks</span>
              </Link>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Resources</h4>
              <Link
                className="flex items-center gap-2 py-1 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-50"
                href="#"
              >
                <BookOpenIcon className="w-4 h-4" />
                <span>Documentation</span>
              </Link>
              <Link
                className="flex items-center gap-2 py-1 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-50"
                href="#"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Examples</span>
              </Link>
              <Link
                className="flex items-center gap-2 py-1 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-50"
                href="#"
              >
                <CompassIcon className="w-4 h-4" />
                <span>Guides</span>
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold">Introduction</h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Welcome to the documentation for our project. Here you'll find everything you need to get started,
              including installation instructions, API documentation, and more.
            </p>
            <section className="mt-10">
              <h2 className="text-2xl font-bold">Installation</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                To get started, you'll need to install our package. You can do this using your preferred package
                manager:
              </p>
              <div className="mt-4 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                <pre className="text-sm font-mono text-gray-900 dark:text-gray-50">
                  <code>npm install my-project</code>
                </pre>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Once you've installed the package, you can start using it in your project.
              </p>
            </section>
            <section className="mt-10">
              <h2 className="text-2xl font-bold">API</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Our API provides a set of components, utilities, and hooks that you can use to build your application.
              </p>
              <div className="mt-4 grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Components</CardTitle>
                    <CardDescription>A collection of reusable UI components.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <KeyIcon className="w-4 h-4" />
                          <span>Button</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <FileInputIcon className="w-4 h-4" />
                          <span>Input</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <CreditCardIcon className="w-4 h-4" />
                          <span>Card</span>
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Utilities</CardTitle>
                    <CardDescription>A set of utility functions and classes.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <PaletteIcon className="w-4 h-4" />
                          <span>Colors</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <RulerIcon className="w-4 h-4" />
                          <span>Spacing</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <TypeIcon className="w-4 h-4" />
                          <span>Typography</span>
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Hooks</CardTitle>
                    <CardDescription>A set of custom hooks to help you build your application.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <PuzzleIcon className="w-4 h-4" />
                          <span>useModal</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <PuzzleIcon className="w-4 h-4" />
                          <span>useToast</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <PuzzleIcon className="w-4 h-4" />
                          <span>useTheme</span>
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
            <section className="mt-10">
              <h2 className="text-2xl font-bold">Resources</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                In addition to the API documentation, we also provide a variety of resources to help you get started.
              </p>
              <div className="mt-4 grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>Detailed guides and explanations for using our project.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <BookOpenIcon className="w-4 h-4" />
                          <span>Getting Started</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <BookOpenIcon className="w-4 h-4" />
                          <span>Advanced Usage</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <BookOpenIcon className="w-4 h-4" />
                          <span>Deployment</span>
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Examples</CardTitle>
                    <CardDescription>Showcase of how to use our project in different scenarios.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <SparklesIcon className="w-4 h-4" />
                          <span>Basic Usage</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <SparklesIcon className="w-4 h-4" />
                          <span>Advanced Integrations</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <SparklesIcon className="w-4 h-4" />
                          <span>Customization</span>
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Guides</CardTitle>
                    <CardDescription>Step-by-step tutorials and best practices.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <CompassIcon className="w-4 h-4" />
                          <span>Styling</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <CompassIcon className="w-4 h-4" />
                          <span>Testing</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="flex items-center gap-2 text-gray-900 dark:text-gray-50 hover:underline"
                          href="#"
                        >
                          <CompassIcon className="w-4 h-4" />
                          <span>Accessibility</span>
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </main>
      </div>
    </MaxWidthWrapper>
  )
}