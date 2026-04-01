"use client"

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { vinylSelectorData } from '@/app/data'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'


const vinylDetailsPage = () => {


const form = useForm()

async function onSubmit() {

}

  return (
    <section>
      <h3>Vinyl Details Page</h3>

      <Form {...form}>
        <form>
          <FormField control={form.control} name="product" render={({ field }) => (
            <FormItem>
              <FormLabel>Products</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {vinylSelectorData.map((item) => (
                                        <SelectItem key={item.id} value={item.selector}>{item.selector}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />


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

export default vinylDetailsPage
