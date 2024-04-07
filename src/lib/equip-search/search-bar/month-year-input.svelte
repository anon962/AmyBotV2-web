<script lang="ts">
    import { getEquipFormContext } from '../form-context/context'

    export let variant: 'min' | 'max'
    export let autofocus = false

    const label = variant === 'min' ? 'From' : 'To'
    const monthControlName = variant === 'min' ? 'min_date_month' : 'max_date_month'
    const yearControlName = variant === 'min' ? 'min_date_year' : 'max_date_year'

    const { register } = getEquipFormContext()
</script>

<fieldset>
    <div class="input-container flex flex-col">
        <legend class="input-label">{label}</legend>

        <div class="flex gap-2 items-center">
            <select
                use:register={monthControlName}
                name={monthControlName}
                {autofocus}
                class="select select-bordered w-full max-w-[6rem]"
            >
                <option value="0">Jan</option>
                <option value="1">Feb</option>
                <option value="2">Mar</option>
                <option value="3">Apr</option>
                <option value="4">May</option>
                <option value="5">Jun</option>
                <option value="6">Jul</option>
                <option value="7">Aug</option>
                <option value="8">Sep</option>
                <option value="9">Oct</option>
                <option value="10">Nov</option>
                <option value="11">Dec</option>
            </select>

            <input
                use:register={yearControlName}
                class="input input-bordered w-[5rem]"
                name={yearControlName}
                type="number"
                min="2016"
                max="2099"
            />
        </div>
    </div>
</fieldset>

<style lang="postcss">
    input,
    select {
        min-height: 0;
        height: 2.5rem;
    }
</style>
