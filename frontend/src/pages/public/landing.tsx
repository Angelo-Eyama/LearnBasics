import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ChevronRight, Code, Zap } from "lucide-react"
import AnimatedSection from "@/components/animated-section"

export const Landing: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 max-w-[2000px] mx-auto">
                {/* Seccion de descripcion */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 2xl:py-64">
                    <div className="container px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                        <AnimatedSection className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl/none">
                                    ¡Lee! ¡Aprende! ¡Comparte!
                                </h1>
                                <p className="mx-auto max-w-[700px] xl:max-w-[900px] 2xl:max-w-[1100px] text-muted-foreground md:text-xl lg:text-2xl xl:text-3xl">
                                    LearnBasics es una aplicacion de aprendizaje en linea que te permite aprender
                                    de manera facil y rapida.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link to="/playground">
                                    <Button size="lg" className="h-12 bg-[rgb(72,202,107)] hover:bg-[rgb(73,164,97)]">
                                        Codificar <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to='/auth/login'>
                                    <Button variant="outline" size="lg" className="h-12">
                                        Iniciar sesion
                                    </Button>
                                </Link>
                            </div>
                            <div className="w-full max-w-3xl overflow-hidden rounded-xl border bg-background shadow-xl">
                                <div className='w-[1200] h-[600] object-cover'></div>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Seccion de características */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-muted/40">
                    <div className="container px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                        <AnimatedSection className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                    Caracteristicas
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                    Conoce nuestras características
                                </h2>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Learn Basics esta lleno de características increibles que te ayudaran a aprender de manera facil y rapida.
                                </p>
                            </div>
                        </AnimatedSection>
                        <div className="mx-auto grid max-w-5xl xl:max-w-7xl grid-cols-1 gap-6 py-10 md:grid-cols-2 lg:grid-cols-3 xl:gap-8 2xl:gap-12">
                            <AnimatedSection delay={0.1}>
                                <Card className="h-full">
                                    <CardHeader>
                                        <Zap className="h-10 w-10 xl:h-12 xl:w-12 text-primary" />
                                        <CardTitle className="mt-4 text-xl xl:text-2xl">Rapido y Responsive</CardTitle>
                                        <CardDescription className="text-base xl:text-lg">
                                            Optimizado para velocidad y rendimiento en todos los dispositivos y tamaños de pantalla.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </AnimatedSection>
                            <AnimatedSection delay={0.4}>
                                <Card className="h-full">
                                    <CardHeader>
                                        <Code className="h-10 w-10 xl:h-12 xl:w-12 text-primary" />
                                        <CardTitle className="mt-4 text-xl xl:text-2xl">Desarrollo Amigable</CardTitle>
                                        <CardDescription className="text-base xl:text-lg">
                                            Construido con TypeScript y React, proporcionando una gran experiencia para desarrolladores.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </AnimatedSection>
                            <AnimatedSection delay={0.7}>
                                <Card className="h-full">
                                    <CardHeader>
                                        <Zap className="h-10 w-10 xl:h-12 xl:w-12 text-primary" />
                                        <CardTitle className="mt-4 text-xl xl:text-2xl">Modo oscuro</CardTitle>
                                        <CardDescription className="text-base xl:text-lg">
                                            Soporte integrado para modo oscuro con una experiencia de cambio sin interrupciones.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-muted/40">
                    <div className="container px-4 md:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                        <AnimatedSection delay={0.6} className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl xl:text-6xl">
                                    ¿ Listo para aprender ?
                                </h2>
                                <p className="mx-auto max-w-[700px] xl:max-w-[900px] text-muted-foreground md:text-xl lg:text-2xl">
                                    Unete a nuestra comunidad y comienza a aprender con nuestra aplicacion.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4 xl:gap-6">
                                <Link to='/auth/register'>
                                    <Button size="lg" className="h-12 xl:h-14 xl:text-lg">
                                        Registrarse
                                        <ChevronRight className="ml-1 h-4 w-4 xl:h-5 xl:w-5" />
                                    </Button>
                                </Link>
                                <Link to='/auth/login'>
                                    <Button variant="outline" size="lg" className="h-12 xl:h-14 xl:text-lg">
                                        Iniciar sesion
                                    </Button>
                                </Link>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            </main>
        </div>
    )
};

export default Landing;