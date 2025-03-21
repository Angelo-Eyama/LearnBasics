import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ChevronRight, Code, Zap } from "lucide-react"
import AnimatedSection from "@/components/animated-section"

export const Landing: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                {/* Seccion de descripcion */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    ¡Lee! ¡Aprende! ¡Comparte!
                                </h1>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                    LearnBasics es una aplicacion de aprendizaje en linea que te permite aprender
                                    de manera facil y rapida.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Button size="lg" className="h-12 bg-[rgb(72,202,107)] hover:bg-[rgb(85,195,115)]">
                                    Codificar
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Link to='/login'>
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
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
                    <div className="container px-4 md:px-6">
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
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-10 md:grid-cols-2 lg:grid-cols-3">
                            <AnimatedSection delay={0.1}>
                                <Card className="h-full">
                                    <CardHeader>
                                        <Zap className="h-10 w-10 text-primary" />
                                        <CardTitle className="mt-4">Rapido y Responsive</CardTitle>
                                        <CardDescription>
                                            Optimizado para velocidad y rendimiento en todos los dispositivos y tamaños de pantalla.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </AnimatedSection>
                            <AnimatedSection delay={0.4}>
                                <Card className="h-full">
                                    <CardHeader>
                                        <Code className="h-10 w-10 text-primary" />
                                        <CardTitle className="mt-4">Desarrollo Amigable</CardTitle>
                                        <CardDescription>
                                            Construido con TypeScript y React, proporcionando una gran experiencia para desarrolladores.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </AnimatedSection>
                            <AnimatedSection delay={0.7}>
                                <Card className="h-full">
                                    <CardHeader>
                                        <Zap className="h-10 w-10 text-primary" />
                                        <CardTitle className="mt-4">Modo oscuro</CardTitle>
                                        <CardDescription>
                                            Soporte integrado para modo oscuro con una experiencia de cambio sin interrupciones.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection delay={0.6} className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">¿ Listo para aprender ?</h2>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Unete a nuestra comunidad y comienza a aprender con nuestra aplicacion.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link to='/register'>
                                    <Button size="lg" className="h-12">
                                        Registrarse
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to='/login'>
                                    <Button variant="outline" size="lg" className="h-12">
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