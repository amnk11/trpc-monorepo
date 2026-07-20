import { z } from 'zod'

export const createFormInputModel = z.object({
    title: z.string().max(55).describe('Title of the form'),
    description: z.string().max(300).optional().describe('Description of the form'),
})

export const createFormOutputModel = z.object({
    id: z.string().describe('ID of the created form'),
})

