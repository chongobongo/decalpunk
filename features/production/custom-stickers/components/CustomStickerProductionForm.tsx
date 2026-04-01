"use client"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"



export function CustomStickerProductionFrom() {

    const form = useForm()
    async function onSubmit() {
    }

    return (
        <section className='border-2 border-amber-500'>
            <h3>Custom Sticker Production Form</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

                        <h3>Submit Form</h3>

                    <div className="self-end">
                        <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
                        <Button disabled={form.formState.isSubmitting} type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </section>
    )
}