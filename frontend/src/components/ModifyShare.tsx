import { useForm } from "@tanstack/react-form"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { api, getUserListBySharedEvent, submitModifyOfSharedEvent } from "@/lib/api"
import { useEffect, useState } from "react"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { PencilLine } from "lucide-react"
import { toast } from "@/hooks/use-toast"

function ModifyShare({ id, reset, currentMonth }: { id: number, reset: any, currentMonth: Date }) {
    const [result, setResult] = useState<{ Email: string; Permission: string; }[]>([]);
    const [userEmail, setUserEmail] = useState<boolean>(false)

    const form = useForm({
        defaultValues: {
            email: '',
            permissions: '',
        },
        async onSubmit({ value }) {
            const { success } = await submitModifyOfSharedEvent(value.email, id, value.permissions, currentMonth.getMonth(), currentMonth.getFullYear())
            if (success) {
                reset()
                toast({
                    title: 'User permissions Modified Successfully'
                })

            }

        }
    },

    );
    useEffect(() => {
        const fetchData = async () => {
            try {
                setResult(await getUserListBySharedEvent(id));
            } catch (error) {
                alert(error)
            }
        };
        fetchData();
    }, []);

    const getPermissions = (email: string): string => {
        for (const user of result) {
            if (user.Email === email) {
                return user.Permission;
            }
        }
        return "";
    }
    return (
        <form className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}>
            <form.Field
                name="email"
                children={(field) => (
                    <div>
                        <Label htmlFor="select-user">Seleziona utente da modificare</Label>
                        <Select
                            onValueChange={(e) => { field.handleChange(e); setUserEmail(true) }}
                        >
                            <SelectTrigger id="select-user">
                                <SelectValue placeholder="Seleziona un utente" />
                            </SelectTrigger>
                            <SelectContent>
                                {result.map((user, index) => (
                                    <SelectItem key={index} value={user.Email}>{user.Email}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            />
            {userEmail && <div className="space-y-0.5">
                <Label>
                    Permessi
                </Label>
                <form.Field
                    name="permissions"
                    validatorAdapter={zodValidator()}
                    validators={
                        {
                            onChange: ({ value }) => value == "" ? 'scegli un permesso' : undefined
                        }
                    }
                    children={(field) => (
                        <div>
                            <Select
                                onValueChange={(e) => field.handleChange(e)}
                                defaultValue={getPermissions(form.getFieldValue('email'))}
                            >
                                <SelectTrigger className="w-[180px] mb-3">
                                    <SelectValue placeholder="Permissions" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="view">Only view</SelectItem>
                                    <SelectItem value="modify">Modify</SelectItem>
                                    <SelectItem value="sharable">Share</SelectItem>
                                </SelectContent>
                            </Select>
                            {field.state.meta.errors ? (
                                <em role="alert">{field.state.meta.errors.join(', ')}</em>
                            ) : null}
                        </div>
                    )}
                />
            </div>}
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <div className="flex justify-end">
                        <Button type="button" disabled={!canSubmit} className="mr-2" variant="outline" onClick={(e) => { e.preventDefault(); reset() }}>Annulla</Button>
                        <Button type="submit" disabled={!canSubmit}>
                            <PencilLine className="w-4 h-4 mr-2" />
                            {isSubmitting ? '...' : 'Modifica evento'}
                        </Button>
                    </div>

                )}
            />

        </form>
    )
}

export default ModifyShare